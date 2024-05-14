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

        [HttpPost("CRMLogin")]
        public IActionResult Login(LoginVM login)
        {
            var tenant = db.Tenants.Where(a => a.Name == login.UserName && a.Password == login.Password && a.IsEmailVerified == true).FirstOrDefault();
            var user = db.Users.Include(a => a.Roles).Where(a => a.Name == login.UserName && a.Password == login.Password).FirstOrDefault();

            if (tenant != null)
            {
                var tenantMatch = tenant.Name == login.UserName && tenant.Password == login.Password;
                if (tenantMatch)
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
                return BadRequest("Invalid Credentials");
            }

            if (user != null)
            {
                var userMatch = user.Name == login.UserName && user.Password == login.Password;
                if (userMatch)
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
                return BadRequest("Invalid Credentials");
            }

            else
            {
                return BadRequest("Invalid Credentials");
            }
        }
    }
}
