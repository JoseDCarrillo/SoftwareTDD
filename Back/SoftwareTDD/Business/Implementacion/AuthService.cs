
using Microsoft.IdentityModel.Tokens;
using SoftwareTDD.Business.Interface;
using SoftwareTDD.Models.Entity;
using SoftwareTDD.Models.Request;
using SoftwareTDD.Models.Response;
using SoftwareTDD.Repository.Interface;
using SoftwareTDD.Ultils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SoftwareTDD.Business.Implementacion
{
    public class AuthService: IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetUserWithRoleByEmailAsync(request.Email);
            if (user == null)
                return null;

            string hashedInput = PasswordHelper.ComputeSha256Hash(request.Password);

            if (user.PasswordPlain != request.Password && user.PasswordHash != hashedInput)
                return null;

            return new LoginResponse
            {
                Token = GenerateJwt(user),
                Role = user.Role.Name,
                Email = user.Email
            };
        }


        private string GenerateJwt(User user)
        {
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
