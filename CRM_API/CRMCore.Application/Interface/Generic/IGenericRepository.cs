using System.Linq.Expressions;

namespace CRMCore.Application.Interface.Generic
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll(params Expression<Func<T, object>>[] includes);
        void Create(T entity);
        void Update(T entity);
        void Delete(int id);
        void Save();
    }
}
