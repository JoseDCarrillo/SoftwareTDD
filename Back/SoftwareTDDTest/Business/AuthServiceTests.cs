using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using FluentAssertions;

using Moq;
using SoftwareTDD.Models.Entity;
using SoftwareTDD.Repository.Interface;
using SoftwareTDD.Ultils;
using SoftwareTDD.Models.Request;
using SoftwareTDD.Business.Implementacion;


namespace SoftwareTDDTest.Business
{

    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepoMock = new();
        private readonly Mock<IConfiguration> _configMock = new();

        private readonly AuthService _sut;

        public AuthServiceTests()
        {
            var jwtSectionMock = new Mock<IConfigurationSection>();
            jwtSectionMock.Setup(s => s.Value).Returns("clave_super_segura_para_testing_123456");

            _configMock.Setup(c => c.GetSection("Jwt:Key")).Returns(jwtSectionMock.Object);

            _sut = new AuthService(_userRepoMock.Object, _configMock.Object);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            _userRepoMock.Setup(r => r.GetUserWithRoleByEmailAsync(It.IsAny<string>()))
                         .ReturnsAsync((User?)null);

            var request = new LoginRequest { Email = "noexiste@test.com", Password = "1234" };
            var result = await _sut.LoginAsync(request);

            result.Should().BeNull();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsInvalid()
        {
            var user = new User
            {
                Id = 1,
                Email = "usuario@test.com",
                PasswordPlain = "otra",
                PasswordHash = PasswordHelper.ComputeSha256Hash("otra"),
                Role = new Role { Name = "Admin" }
            };

            _userRepoMock.Setup(r => r.GetUserWithRoleByEmailAsync(It.IsAny<string>()))
                         .ReturnsAsync(user);

            var request = new LoginRequest { Email = "usuario@test.com", Password = "incorrecta" };
            var result = await _sut.LoginAsync(request);

            result.Should().BeNull();
        }

        
    }
}
