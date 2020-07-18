if (process.env.NODE_ENV == 'production') {
    module.exports = {
        mongoURI: "mongodb+srv://admin:<Passw0rd%21>@app.znsa8.mongodb.net/<app1>?retryWrites=true&w=majority",
        secret: "yoursecret"
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/app1",
        secret: "yoursecret"
    };
}