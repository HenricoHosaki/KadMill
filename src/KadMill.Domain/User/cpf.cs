namespace KadMill.Domain.User;

public record Cpf {
    public string Number { get; }

    public Cpf(string number){

        if (number == null){
            throw new ArgumentNullException(nameof(number),"Cpf cannot be null");
        }
        
        string filterNumber = number.Replace("-","").Replace(".","");

        if (filterNumber.Length != 11){
            throw new ArgumentOutOfRangeException(nameof(number),"Cpf might have 11 characters");
        }

        if (!long.TryParse(filterNumber, out var result)){
            throw new FormatException("Cpf must contain only numbers");
        }

        Number = filterNumber;
    }
}
