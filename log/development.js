module.exports = {
    logging: {

        exitOnError: false,

        console:{
            enabled: true,
            level:'silly',
            timestamp:true,
            handleExceptions: true,
            json: false,
            colorize: true
        }

    },

    mongo: {
        db_host: '127.0.0.1',
        db_port: 27017,
        db_name: "MoneyPal", 
        debug: false
    },


    server:{
        host: '127.0.0.1',
        port: 8082,
    },

}
