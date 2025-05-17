using SoftwareTDD.Models.Request;
using SoftwareTDD.Models.Response;

namespace SoftwareTDD.Business.Interface
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
    }
}
