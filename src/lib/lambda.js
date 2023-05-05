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

export const defaultLambda = `const exampleDate = new Date().toLocaleDateString()

const config = { headers: { auth: 0 } };
const result = await this.axios.get("https://jsonplaceholder.typicode.com/todos/1", config);

return \`
<p style="font-weight: bold" >Date</p>
<p>\${exampleDate}</p>
<p style="font-weight: bold" >API Request</p>
<p>\${JSON.stringify(result.data)}</p>
\``