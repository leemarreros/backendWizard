var Car = require('./models/Car');
var Household = require('./models/Household');
var Person = require('./models/Person');

module.exports = function(router) {
    router.route('/authfb')
        .post(function(req, res){
            Household.findOne( {fbId: req.body.fbId},
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
            console.log(newHouseData)
            Household.update( {fbId: req.body.fbId}, {$set: newHouseData}, function(err, data){
                if (err) {
                        console.log(err);
                        return;
                 }
                 Household.findOne( {fbId: req.body.fbId},
                    function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    res.json({status: 'houseUpdated', houseData: data});
                 }).populate('people').populate('cars');
            });
        })

    router.route('/createperson')
        .post(function(req, res) {
            var personData = {};
            !!req.body.firstname ? personData.firstname = req.body.firstname : null;
            !!req.body.lastname ? personData.lastname = req.body.lastname : null;
            !!req.body.email ? personData.email = req.body.email : null;
            !!req.body.age ? personData.age = req.body.age : null;
            !!req.body.gender ? personData.gender = req.body.gender : null;
            
            Person.create(personData, function(err, person) {
                if (err) {
                    console.log(err);
                    return;
                }
                Household.update( {fbId: req.body.fbId}, {$addToSet: {people: person._id}}, function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json({status: 'personCreated'});
                })
                    
            })
            
        });
    
    router.route('/peopledata/:household_id')
        .get(function(req, res) {
            Household.findOne( {fbId: req.params.household_id}, {people: 1},
                function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json({status: 'dataRetrieved', peopleData: data});
                }).populate('people');
        })
    
    router.route('/deleteperson')
        .post(function(req, res) {
            Person.remove({_id: req.body._id}, function(err, person) {
                if (err) res.send(err);
                Household.update({fbId: req.body.fbId}, {$pull: {people: req.body._id}}, function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    Household.findOne( {fbId: req.body.fbId}, {people: 1}, function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.json({status: 'personDeleted', peopleData: data});
                    }).populate('people');
                })
            })
        })
    
    router.route('/createcar')
        .post(function(req, res) {
            var carData = {};
            !!req.body.make ? carData.make = req.body.make : null;
            !!req.body.model ? carData.model = req.body.model : null;
            !!req.body.year ? carData.year = req.body.year : null;
            !!req.body.licenseplate ? carData.licenseplate = req.body.licenseplate : null;
            !!req.body.owner ? carData.owner = req.body.owner : null;
            !!req.body.personId ? carData.ownerId = req.body.personId : null;
             
             Car.create(carData, function(err, car) {
                if (err) {
                    console.log(err);
                    return;
                }
                Household.update( {fbId: req.body.fbId}, {$addToSet: {cars: car._id}}, function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    Person.update( {_id: req.body.personId}, {$addToSet: {cars: car._id}}, function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.json({status: 'carCreated'});
                        
                    })
                })
                    
            })
        })
    
    router.route('/carsdata/:household_id')
        .get(function(req, res) {
            Household.findOne( {fbId: req.params.household_id}, {cars: 1},
                function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json({status: 'dataRetrieved', carsData: data});
                }).populate('cars');
        })
     
     router.route('/deletecar')
        .post(function(req, res) {
            Car.remove({_id: req.body._id}, function(err, person) {
                if (err) res.send(err);
                Household.update({fbId: req.body.fbId}, {$pull: {cars: req.body._id}}, function(err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    Person.update({_id: req.body.personId}, {$pull: {cars: req.body._id}}, function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                    
                    Household.findOne( {fbId: req.body.fbId}, {cars: 1}, function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.json({status: 'carDeleted', carsData: data});
                    }).populate('cars');
                })
            })
        })
}