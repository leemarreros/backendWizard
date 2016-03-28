var Car = require('./models/Car');
var Household = require('./models/Household');
var Person = require('./models/Person');

module.exports = function(router) {
    router.route('/authfb')
        .post(function(req, res){
            console.log('posting')
            Household.findOne( {fbId: req.body.fbId}, {_id: 1},
                function(err, data) {
                    if (err) return;
                    console.log(data);
                    if (data) {
                        res.json({status: 'dataRetrieved', data: data});
                    } else {
                        var household = new Household();
                        household.fbId = req.body.fbId;
                        household.save(function(err, data) {
                            if (err) console.log(err);
                            res.json({status: 'houseCreated'})
                            return;
                        })
                    }
                })
        })
}