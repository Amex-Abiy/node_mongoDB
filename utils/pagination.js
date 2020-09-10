const paginationHandler = async(query, Model) => {
    const page = parseInt(query.page) || 1;
    // number of data to be seen on a single page
    const limit = parseInt(query.limit) || 2;
    const skip = (page - 1) * limit
    const startIndex = skip;
    const endIndex = page * limit;
    const total = await Model.countDocuments()
    let pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    return { pagination, skip, limit };
}

module.exports = paginationHandler;