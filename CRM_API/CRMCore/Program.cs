using CRMCore.Application.Interface.Accounts;
using CRMCore.Application.Interface.Contacts;
using CRMCore.Application.Interface.EmailVerification;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Interface.Leads;
using CRMCore.Application.Interface.Opportunities;
using CRMCore.Application.Interface.Roles;
using CRMCore.Application.Interface.Tasks;
using CRMCore.Application.Interface.Tenants;
using CRMCore.Application.Interface.Users;
using CRMCore.Application.Repository.Accounts;
using CRMCore.Application.Repository.Contacts;
using CRMCore.Application.Repository.EmailVerification;
using CRMCore.Application.Repository.Generic;
using CRMCore.Application.Repository.Leads;
using CRMCore.Application.Repository.Opportunities;
using CRMCore.Application.Repository.Roles;
using CRMCore.Application.Repository.Tasks;
using CRMCore.Application.Repository.Tenants;
using CRMCore.Application.Repository.Users;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.EmailVerification;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data.Entity;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Migration

builder.Services.AddMvc();
builder.Services.AddDbContext<CRMCoreDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("connection"));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});


// AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// Register interface and classes
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITenantRepository, TenantRepository>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IOpportunityRepository, OpportunityRepository>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();


// Allow Nullable values
builder.Services.AddControllers().AddNewtonsoftJson();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddControllersWithViews();


// For Sending Email
var configuration = builder.Configuration;
builder.Services.Configure<MailSettings>(configuration.GetSection("MailSettings"));
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IEmailRepository, EmailRepository>();
builder.Services.AddTransient<ITenantRegisterRepository, TenantRegisterRepository>();


// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});


// For Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);//You can set Time
});
builder.Services.AddMvc();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseSession();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
