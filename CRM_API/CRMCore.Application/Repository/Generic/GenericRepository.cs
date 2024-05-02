using AutoMapper;
using CRMCore.Application.Interface.Generic;
using CRMCore.EntityFrameWorkCore;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CRMCore.Application.Repository.Generic
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly CRMCoreDbContext db;
        private readonly DbSet<T> entities;

        public GenericRepository(CRMCoreDbContext context, IMapper _mapper)
        {
            db = context;
            entities = context.Set<T>();
        }
    
        public IEnumerable<T> GetAll(params Expression<Func<T, object>>[] includes)
        {
            var query = db.Set<T>().AsQueryable();
            foreach (Expression<Func<T, object>> i in includes)
            {
                query = query.Include(i);
            }
            return query.ToList();
        }

        public void Create(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Add(entity);
            Save();
        }

        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Update(entity);
            Save();
        }

        public void Delete(int id)
        {
            if (id == 0)
            {
                throw new ArgumentNullException("entity");
            }
            var entity = entities.Find(id);
            entities.Remove(entity);
            Save();
        }

        public void Save()
        {
            db.SaveChanges();
        }
    }
}
