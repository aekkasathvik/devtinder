const validateEditProfile = (req) => {
    if (!req.body || typeof req.body !== "object") {
        return false;
    }

    const ALLOWED_FIELDS = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "dateOfBirth",
        "interests"
    ];

    return Object.keys(req.body).every((field) =>
        ALLOWED_FIELDS.includes(field)
    );
};

module.exports = validateEditProfile;
