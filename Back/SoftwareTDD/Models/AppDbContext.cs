using Microsoft.EntityFrameworkCore;
using SoftwareTDD.Models.Entity;

namespace SoftwareTDD.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
    }
}
