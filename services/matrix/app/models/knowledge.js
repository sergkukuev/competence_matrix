var mongoose = require('mongoose');

let Schema = mongoose.Schema;
let Knowledge = new Schema({
	// Наименование знания
	name: {	
		type: String,
		required: true
	},
	// Основная категория
	category: { 
		type: String,
		default: "None"
	},
	// Подкатегория знания
	sub_category: {
		type: String,
		default: "None"
	},
	// Ранжирование знания (Массив из 4-ех рангов: 0 - базовый уровень, 4 уровень эксперта)
	marks: [{
		type: String,
		required: true
	}]
});

Knowledge.virtual('date').get(function() {
		return this._id.getTimestamp();
	});

// Create
Knowledge.statics.create = function(knowledge, callback) {
	return knowledge.save(callback);
}

// Read
Knowledge.statics.read = function(page = 0, count = 0, callback) {
	if (count == 0) {
		return this.find(function(err, knowledges) {
			if (err)
				callback(err, null);
			else {
				if (knowledges) {
					let result = [];
					for (let i = 0; i < knowledges.length; i++)
						result[i] = getKnowledgeInfo(knowledges[i]);
					callback(null, result);
				}
				else
					callback(null, null);
			}	
		});
	}
	else {
		return this.find(function(err, knowledges) {
			if (err)
				callback(err, null);
			else {
				if (knowledges) {
					let result = [];
					for (let i = 0; i < knowledges.length; i++)
						result[i] = getKnowledgeInfo(knowledges[i]);
					callback(null, result);
				}
				else
					callback(null, null);
			}	
		}).skip(page * count).limit(count);
	}
}

Knowledge.statics.read = function(id, callback) {
	return this.findById(id, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, getKnowledgeInfo(knowledge)) : callback(null, null));
	});
}

function getKnowledgeInfo(knowledge) {
	let item = {
		id			: knowledge._id,
		name		: knowledge.name,
		category	: knowledge.category,
		sub_category: knowledge.sub_category,
		marks		: knowledge.marks
	};
	return item;
}

// Update
Knowledge.statics.updateById = function(id, data, callback) {
	return this.findByIdAndUpdate(id, {
			name		: data.name, 
			category	: data.category,
			sub_category: data.sub_category, 
			marks		: data.marks
		}, {new: true}, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, getKnowledgeInfo(knowledge)) : callback(null, null));
	});
}

// delete
Knowledge.statics.delById = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, getKnowledgeInfo(knowledge)) : callback(null, null));
	});
}

Knowledge.statics.clear = function(callback) {
	this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

mongoose.model("Knowledge", Knowledge);