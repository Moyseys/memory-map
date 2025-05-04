using System.ComponentModel.DataAnnotations;

namespace Dotnet.Dal.models;

public class user
{
    [Key]
    public int id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string name { get; set; }    
    
    [MaxLength(100)]
    public string lastname { get; set; }
    
    [Required]
    [EmailAddress]
    [MaxLength(100)]   
    public string email { get; set; }
    
    [Required]
    [MaxLength(100)]   
    public string password { get; set; }
}