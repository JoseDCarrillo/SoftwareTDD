using SoftwareTDD.Models.Entity;

namespace SoftwareTDD.Repository.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetUserWithRoleByEmailAsync(string email);
    }
}
