import db from "../database.js"

// TEMPORARY SOLUTION FOR AUTHORIZATION STATE
let isLoggedIn = false;
export async function checkAuthorized(req,res,next) {
    const allowedEndpoints = ['/login'];

    if(isLoggedIn || allowedEndpoints.includes(req.url)) next();
    else{
        res.redirect("/login");
    }
}

export async function getAllUsers(){
    try{
        const res = await db.query("SELECT * FROM users");
        return res.rows;
    }catch(error){
        console.error(`ERROR/ getAllUsers(): ${error}`);
        throw error;
    }
}

export async function authorize(userData){
    try{
        const res = await db.query("SELECT * FROM users WHERE email = $1", [userData.email]);
        if(res.rows.length < 1) throw new Error(`Email ${userData.email} was not found!`);
        
        const user = res.rows[0];
        if(user.password.trim() !== userData.password.trim()) throw new Error(`Access denied! Password incorrect!`);
        else isLoggedIn = true;

        return true;
    }catch(error){
        console.error(`ERROR/ authorize(userData): ${error}`);
        throw error;
    }
}