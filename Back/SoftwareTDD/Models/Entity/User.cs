

using System.Data;

namespace SoftwareTDD.Models.Entity
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? PasswordPlain { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
    }
}
