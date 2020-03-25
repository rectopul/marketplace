const validatePhone = (value) => {
    const regex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g

    if (!regex.test(value))
        throw new Error('phone format error!')
}

module.exports = validatePhone