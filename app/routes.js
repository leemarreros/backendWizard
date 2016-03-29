var Car = require('./models/Car');
var Household = require('./models/Household');
var Person = require('./models/Person');

module.exports = function(router) {
    router.route('/authfb')
        .post(function(req, res){
            console.log('posting')
            Household.findOne( {fbId: req.body.fbId},
                function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (data) {
                        console.log('HouseholdData', data);
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
                }).populate('people').populate('cars');
        })
    router.route('/housedataupdate')
        .post(function(req, res) {
            var newHouseData = {};
            !!req.body.address? newHouseData.address = req.body.address : null; 
            !!req.body.zipcode? newHouseData.zipcode = req.body.zipcode : null;
            !!req.body.city? newHouseData.city = req.body.city : null;
            !!req.body.state? newHouseData.state = req.body.state : null;
            newHouseData.bedrooms = req.body.bedrooms;
            
            console.log(newHouseData);
            Household.update( {fbId: req.body.fbId}, {$set: newHouseData}, function(err, data){
                if (err) {
                        console.log(err);
                        return;
                 }
                res.json({status: 'houseUpdated'});
            })
        })

    router.route('/createperson')
        .post(function(req, res) {
            var personData = {};
            !!req.body.firstname ? personData.firstname = req.body.firstname : null;
            !!req.body.lastname ? personData.lastname = req.body.lastname : null;
            !!req.body.email ? personData.email = req.body.email : null;
            !!req.body.age ? personData.age = req.body.age : null;
            !!req.body.gender ? personData.gender = req.body.gender : null;
            
            console.log('personData', personData);
            Person.create(personData, function(err, person) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('personCreated', person._id);
                Household.update( {fbId: req.body.fbId}, {$addToSet: {people: person._id}}, function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json({status: 'personCreated'});
                })
                    
            })
            
        })        
}