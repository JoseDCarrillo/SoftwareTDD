using SoftwareTDD.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using SoftwareTDD.Models;
using SoftwareTDD.Models.Entity;

namespace SoftwareTDD.Repository.Implementacion
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserWithRoleByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
