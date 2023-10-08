import CryptoJS from 'crypto-js'

export function encrypt(value, password) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), password).toString()
}

export function decrypt(value, password) {
    var bytes = CryptoJS.AES.decrypt(value, password)
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    return decryptedData
}
