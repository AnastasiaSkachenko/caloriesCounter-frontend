import axios from "axios"
import { useEffect, useState } from "react"
import { Product } from "../components/interfaces"


const useLoadProducts = (page: number) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(false)
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/get-products/",
      params: { page }
    }).then( res => {
      setProducts(res.data.products)
      setHasMore(res.data.hasMore)
      setLoading(false)
    }).catch(e => {
      setError(true)
      console.log(e)
    })

  }, [page])

  return { loading, error, products, hasMore}
}

export default useLoadProducts