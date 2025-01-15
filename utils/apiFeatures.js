class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }        

    filter(){
        const queryObj = {...this.queryString};
        // console.log(queryObj);
        const excludedFields = ['page','sort','limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(queryObj);

        let queryStr = JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b{gte|gt|lte|lt}\b/g, match => `$${match}`);             // b ensures that word is next to a non-word charcter (such as space punctuation, etc)
        // console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(JSON.parse(queryStr), 'sldjfsd');
        // console.log(this.queryString);
        return this;        
    }
    sort(){
         // Sorting
        // console.log(req.query.sort);
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            // console.log(sortBy);
            // query = query.sort(req.query.sort);
            this.query = this.query.sort(sortBy);
            // sort('price ratingAverage');                    // if price are same then move to next parameter for sorting
        }
        else{
            this.query = this.query.sort('-createdAT');
        }
        return this;
    }
    limitFields(){
        // Field limiting
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select('-__v');           // exclude __v field
        }
        return this;
    }
    paginate(){
        // Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures