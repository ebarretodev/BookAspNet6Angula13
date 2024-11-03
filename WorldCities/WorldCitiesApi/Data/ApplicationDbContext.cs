using Microsoft.EntityFrameworkCore;
using WorldCitiesApi.Data.Models;

namespace WorldCitiesApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(): base()
        {
        }

        public ApplicationDbContext(DbContextOptions options): base(options)
        {
        }

        public DbSet<City> Cities => Set<City>();
        public DbSet<Country> Countries => Set<Country>();
    }
}
