using System.Security.Cryptography;
using System.Text;

namespace SoftwareTDD.Ultils
{
    public class PasswordHelper
    {
        public static string ComputeSha256Hash(string rawData)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            return Convert.ToBase64String(bytes);
        }
    }
}
