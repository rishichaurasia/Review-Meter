const Review = require('../models/review');

module.exports.postReview = function async (req, res) {
    req.body.userId = req.user.id;
    Review.create(req.body)
        .then(review => {
            Review.findById(review._id)
            .populate('userId', '-email -password -__v')
            .lean()
            .exec(function (err, result) {
                res.status(200).send(result);
            });
        })
        .catch(err => {
            console.error(err);
            res.status(400).send(err);
        });
}

module.exports.deleteReview = async function(req,res) {
    try{
        const review = await Review.findById(req.params.id);
        
        if(review.userId == req.user.id){
            review.remove();
            return res.status(200).send(req.params.id);
        }
    }catch(err){
        res.status(500).send(err);
    }
}