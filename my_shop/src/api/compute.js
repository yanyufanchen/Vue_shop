import {
    getCategoriesList_api,   
    getattributes_api,
    changeParams_api,
    addCateParams_api,
    deleteCateParams_api,
    
  } from '@/api'


  // (分类参数获取)
export const getCateParamsCommon=async (row)=>{
    const { data: res } = await getattributes_api({
        id: row.id,
        sel: row.sel
      })
      return res
}
 // 发请求，更新数据库指定id分类的参数信息(分类参数更新)
export const changeParamsCommon=async (row)=>{
        const { data: res } = await changeParams_api({
          id: row.cat_id,
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        return res
}


