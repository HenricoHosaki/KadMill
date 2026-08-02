namespace KadMill.Domain.User;

public class User
{
    public Guid Id { get; private set; }
    public string AuthProviderId { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public Cpf Cpf { get;}
    public WorkFunction WorkFunction { get; private set; }
    public UserSector UserSector { get; private set; }
    public DateTime AdmissionTime { get; private set; }

    private User(){}

    public User (Guid id, string authProviderId, string name, string email, Cpf cpf, WorkFunction workFunction, UserSector userSector, DateTime admissionTime)
    {

        ArgumentException.ThrowIfNullOrEmpty(name);
        ArgumentException.ThrowIfNullOrEmpty(email);

        Id = id;
        AuthProviderId = authProviderId;
        Name = name;
        Email = email;
        Cpf = cpf;
        WorkFunction = workFunction;
        UserSector = userSector;
        AdmissionTime = admissionTime;
    }
}