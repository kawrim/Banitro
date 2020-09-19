export const mustFilled = (value) => (value) ? null : 'این فیلد نمی تواند خالی باشد'
export const phoneValidate = (value) => {
    if (!value) return 'این فیلد نمی تواند خالی باشد'
    else if (!/(^(09|9)\d{9}$)/.test(value))
        return 'نا معتبر'
    else return null
}

export const showPrice = (price) =>  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

