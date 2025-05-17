using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SoftwareTDD.Business.Implementacion;
using SoftwareTDD.Business.Interface;
using SoftwareTDD.Controllers;
using SoftwareTDD.Models.Request;
using SoftwareTDD.Models.Response;

namespace SoftwareTDDTest.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock = new();
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _controller = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Login_ShouldReturnBadRequest_WhenModelIsInvalid()
        {
            // Arrange
            var authServiceMock = new Mock<IAuthService>();
            var controller = new AuthController(authServiceMock.Object);

            controller.ModelState.AddModelError("Email", "Email es requerido");
            var request = new LoginRequest();

            // Act
            var result = await controller.Login(request);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();

            var badRequest = result as BadRequestObjectResult;
            badRequest.Should().NotBeNull();
            badRequest!.Value.Should().Be("Datos de entrada inválidos");
        }


        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenLoginFails()
        {
            // Arrange
            var request = new LoginRequest { Email = "x@test.com", Password = "1234" };
            _authServiceMock.Setup(s => s.LoginAsync(request)).ReturnsAsync((LoginResponse?)null);

            // Act
            var result = await _controller.Login(request);

            // Assert
            result.Should().BeOfType<UnauthorizedObjectResult>();
            var unauthorized = result as UnauthorizedObjectResult;
            unauthorized!.Value.Should().Be("Credenciales incorrectas");
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenLoginSucceeds()
        {
            // Arrange
            var request = new LoginRequest { Email = "x@test.com", Password = "1234" };
            var loginResponse = new LoginResponse
            {
                Email = request.Email,
                Role = "Admin",
                Token = "fake-jwt-token"
            };

            _authServiceMock.Setup(s => s.LoginAsync(request)).ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.Login(request);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var ok = result as OkObjectResult;
            ok!.Value.Should().BeEquivalentTo(loginResponse);
        }
    }
}
