using CRMCore.Application.Interface.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CRMCore.Application.Dto.Tenants;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using CRMCore.Application.Dto.Login;

namespace CRMCore.Web.Controllers.Login
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly CRMCoreDbContext db;
        private readonly IConfiguration configuration;

        public LoginController(CRMCoreDbContext context, IConfiguration _configuration)
        {
            db = context;
            configuration = _configuration;
        }

        //[HttpPost("CRMLogin")]
        //public IActionResult Login(LoginVM login)
        //{
        //    var tenant = db.Tenants.Where(a => a.Name == login.UserName && a.Password == login.Password && a.IsEmailVerified == true).FirstOrDefault();
        //    var user = db.Users.Include(a => a.Roles).Where(a => a.Name == login.UserName && a.Password == login.Password).FirstOrDefault();

        //    if (tenant != null)
        //    {
        //        HttpContext.Session.SetInt32("SessionTenantId", tenant.Id);

        //        var claims = new[]
        //        {
        //            new Claim(ClaimTypes.Role, tenant?.Name)
        //        };
        //        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
        //        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        //        var tokenOptions = new JwtSecurityToken(issuer: configuration["JWT:ValidIssuer"],
        //            audience: configuration["JWT:ValidAudience"],
        //            claims: claims,
        //            expires: DateTime.Now.AddDays(1),
        //            signingCredentials: signinCredentials
        //        );
        //        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        //        return Ok(new { Token = tokenString, UserInfo = tenant });
        //    }

        //    if (user != null)
        //    {
        //        HttpContext.Session.SetInt32("SessionUserId", user.Id);

        //        var claims = new[]
        //        {
        //            new Claim(ClaimTypes.Role, user?.Roles?.Name)
        //        };
        //        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
        //        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        //        var tokenOptions = new JwtSecurityToken(issuer: configuration["JWT:ValidIssuer"],
        //            audience: configuration["JWT:ValidAudience"],
        //            claims: claims,
        //            expires: DateTime.Now.AddDays(1),
        //            signingCredentials: signinCredentials
        //        );
        //        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        //        return Ok(new { Token = tokenString, UserInfo = user });
        //    }

        //    else
        //    {
        //        return BadRequest("Invalid Credentials");
        //    }
        //}

        [HttpPost("CRMLogin")]
        public IActionResult Login(LoginVM login)
        {
            bool usernameContainsUppercase = login.UserName.Any(char.IsUpper);

            var loginUsernameLower = login.UserName.ToLower();

            var tenant = db.Tenants.FirstOrDefault(a => a.Name.ToLower() == loginUsernameLower &&
                                                         a.IsEmailVerified == true);

            var user = db.Users.Include(a => a.Roles).FirstOrDefault(a => a.Name.ToLower() == loginUsernameLower);

            bool passwordContainsUppercase = login.Password.Any(char.IsUpper);

            var passwordLower = login.Password.ToLower();

            if (tenant != null && usernameContainsUppercase && passwordContainsUppercase && tenant.Password == login.Password)
            {
                HttpContext.Session.SetInt32("SessionTenantId", tenant.Id);

                var claims = new[]
                {
                    new Claim(ClaimTypes.Role, tenant?.Name)
                };
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(issuer: configuration["JWT:ValidIssuer"],
                    audience: configuration["JWT:ValidAudience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                return Ok(new { Token = tokenString, UserInfo = tenant });
            }
            else if (user != null && usernameContainsUppercase && passwordContainsUppercase && user.Password == login.Password)
            {
                HttpContext.Session.SetInt32("SessionUserId", user.Id);

                var claims = new[]
                {
                    new Claim(ClaimTypes.Role, user?.Roles?.Name)
                };
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(issuer: configuration["JWT:ValidIssuer"],
                    audience: configuration["JWT:ValidAudience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                return Ok(new { Token = tokenString, UserInfo = user });
            }
            else
            {
                // Handle invalid credentials
                return BadRequest("Invalid Credentials");
            }
        }
    }
}
