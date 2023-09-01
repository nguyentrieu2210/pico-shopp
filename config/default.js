module.exports = {
    app: {
        port:3000,
        static_folder: `${__dirname}/../src/public`, 
        //đường dẫn tới thư mục chứa data tĩnh
        router: `${__dirname}/../src/routers/web`,
        view_folder: `${__dirname}/../src/apps/views`,
        view_engine:"ejs",
        session_key: "Pico_Supermarket",
        tmp: `${__dirname}/../src/tmp`,
    },
    mail: {
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: "nguyenvantrieu092003@gmail.com",
            pass: "ojhppdawcfmjofet",	
        }
    }
    
}
