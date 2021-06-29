class APIFeatures {
  constructor(Query, queryString) {
    this.Query = Query;
    this.queryString = queryString;
  }

  filter() {
    //distructuring the query object for getting a hard copy of it 'immutable' and excluding the non modeled fields
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    //replacing the filters with the mongodb's ones
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matched) => `$${matched}`
    );

    this.Query = this.Query.find(JSON.parse(queryStr));
    return this;

    //getting a query with filters we defined
    //let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.Query = this.Query.sort(sortBy);
    } else {
      this.Query = this.Query.sort('createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.Query = this.Query.select(fields);
    } else {
      this.Query = this.Query.select('-__v');
    }
    return this;
  }

  paginate() {
    if (!this.queryString.page && !this.queryString.limit) {
      return this;
    }
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 1;
    const skip = (page - 1) * limit;
    this.Query = this.Query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
