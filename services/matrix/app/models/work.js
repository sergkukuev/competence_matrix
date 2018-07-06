var mongoose = require('mongoose');

let Schema = mongoose.Schema;
// Модель работ
let Work = new Schema({
    // Наименование работы
    name: {
        type: String, 
        required: true
    },
    // Список идентификаторов задач для данной работы
    tasks: [Schema.Types.ObjectId]
});

Work.virtual('date').get(function() {
    return this._id.getTimestamp();
});

Work.statics.create = function(work, callback) {
    return work.save(function(err, result) {
		err ? callback(err, null) : callback(null, Format(result));
	});
}

Work.statics.read = function(page = 0, count = 0, callback) {
    if (count == 0) {
        return this.find(function(err, work) {
            if (err)
                callback(err, null);
            else {
                if (work) {
                    let res = [];
                    for (let i = 0; i < work.length; i++)
                        res[i] = Format(work[i]);
                    callback(null, res);
                }
                else
                    callback(null, null);
            }
        });
    }
    else {
        return this.find(function(err, work) {
            if (err)
                callback(err, null);
            else {
                if (work) {
                    let res = [];
                    for (let i = 0; i < work.length; i++)
                        res[i] = Format(work[i]);
                    callback(null, res);
                }
                else
                    callback(null, null);
            }
        }).skip(page * count).limit(count);
    }
}

Work.statics.read =  function(id, callback) {
    return this.findById(id, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
    });
}

Work.statics.update = function(id, data, callback) {
    return this.findByIdAndUpdate(id, { 
        name: data.name, 
        tasks: data.tasks 
    }, { new: true }, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
    });
}

Work.statics.delete = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, work) {
		err ? callback(err, null) : (obj ? callback(null, Format(work)) : callback(null, null));
	});
}

Work.statics.clear = function(callback) {
	return this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

function Format(work) {
    let item = {
        id: work._id,
        name: work.name,
        id_tasks: work.tasks
    }
    return item;
}

mongoose.model("Work", Work);