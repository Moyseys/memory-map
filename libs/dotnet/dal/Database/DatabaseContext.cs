using Microsoft.EntityFrameworkCore;

namespace Dotnet.Dal.Database;

public class DatabaseContext : DbContext
{
    private String connectionString = "";

    public DatabaseContext(DbContextOptions<DatabaseContext> options) 
        : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}