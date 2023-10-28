import http from '../http-common';

const login = async (email: string, password: string): Promise<any> => {

    const request: LoginRequest = 
    {
        email,
        password
    };

    const parsedRequest: string = JSON.stringify(request);

    return await http.post("/api/login", parsedRequest);
};

const LoginService = {
    login,
};

export default LoginService;