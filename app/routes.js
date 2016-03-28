var Car = require('./models/Car');
var Household = require('./models/Household');
var Person = require('./models/Person');

module.exports = function(router) {
    router.route('/authfb')
        .post(function(req, res){
            console.log('posting')
            Household.findOne( {fbId: req.body.fbId}, {_id: 1},
                function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (data) {
                        res.json({status: 'dataRetrieved', houseData: data});
                    } else {
                        var household = new Household();
                        household.fbId = req.body.fbId;
                        household.save(function(err, data) {
                            if (err) console.log(err);
                            res.json({status: 'houseCreated', houseData: null})
                            return;
                        })
                    }
                })
        })
    router.route('/housedataupdate')
        .post(function(req, res) {
            var newHouseData = {};
            !!req.body.address? newHouseData.address = req.body.address : null; 
            !!req.body.zipcode? newHouseData.zipcode = req.body.zipcode : null;
            !!req.body.city? newHouseData.city = req.body.city : null;
            !!req.body.state? newHouseData.state = req.body.state : null;
            
            Household.update( {fbId: req.body.fbId}, {$set: newHouseData}, function(err, data){
                if (err) {
                        console.log(err);
                        return;
                 }
                res.json({message: 'Update succesfully', status: 'houseUpdated'});
            })
        })
        
}