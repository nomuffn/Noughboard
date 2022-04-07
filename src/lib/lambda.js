import axios from 'axios'

export class Lambda {
    constructor(code) {
        this.axios = axios
        this.code = code
    }

    run() {
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
        return new AsyncFunction(this.code).bind(this)()
    }
}

export const defaultLambda = `const url = "";
const config = { headers: { auth: 0 } };
const result = await this.axios.get(url, config);
return [
    {
        type: "text",
        value: result,
        style: "font-weight: bold"
    }
];`
