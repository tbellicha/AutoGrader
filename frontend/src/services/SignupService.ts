import httpCommon from "../http-common";

const signup = async (email: string, password: string, first_name: string, last_name: string) : Promise<any> => {

    const signupRequest: SignupRequest = {
        email,
        password,
        first_name,
        last_name,
    };

    const parsedRequest: string = JSON.stringify(signupRequest);

    return await httpCommon.post("/api/signup/student", parsedRequest);
};

const SignupService = {
  signup,
};

export default SignupService;