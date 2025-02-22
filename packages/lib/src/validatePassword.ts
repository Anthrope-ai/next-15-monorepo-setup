const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type ValidatePasswordOutput = {
    valid : boolean
    errorMessage : string | null
}

export default function validatePassword (password : string) : ValidatePasswordOutput{
    const valid = passRegex.test(password);

    return {
        valid,
        errorMessage : !valid ? "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character." : null
    }
}