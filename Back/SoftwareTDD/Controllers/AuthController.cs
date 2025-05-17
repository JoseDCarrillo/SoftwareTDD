using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;
using SoftwareTDD.Business.Implementacion;
using SoftwareTDD.Business.Interface;
using SoftwareTDD.Models.Request;

namespace SoftwareTDD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest("Datos de entrada inválidos");

            var response = await _authService.LoginAsync(request);

            if (response == null)
                return Unauthorized("Credenciales incorrectas");

            return Ok(response);
        }
    }
}
