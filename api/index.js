module.exports = async (req, res) => {    
    res.end(`MONGODB_URI2: ${process.env.MONGODB_URI}`)
}