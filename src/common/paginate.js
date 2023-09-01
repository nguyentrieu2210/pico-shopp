
module.exports = ( totalPage, page, delta=2) => {
    const left = page - delta;
    const right = page + delta;
    const paginate = [];
    for(let i = 1; i<= totalPage; i++) {
        if(i === 1 || i === totalPage
            || (i>=left && i<=right) 
        ){
            paginate.push(i);
        }
        if((i === left-1 && i>1) || (i === right+1 && i<totalPage)) {
            paginate.push("...");
        }
    }
    return paginate;
}