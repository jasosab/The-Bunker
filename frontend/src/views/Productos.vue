<template>
  <div class="min-h-screen py-20">
    <div class="container-custom">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-4">
          Productos Premium
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Los mejores productos para el cuidado personal masculino
        </p>
      </div>

      <!-- Filtros -->
      <div class="mb-8 flex flex-wrap gap-4 justify-center">
        <button
          v-for="categoria in categorias"
          :key="categoria"
          @click="categoriaSeleccionada = categoria"
          :class="[
            'px-6 py-2 rounded-lg font-semibold transition-all',
            categoriaSeleccionada === categoria
              ? 'bg-primary-500 text-white shadow-glow'
              : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
          ]"
        >
          {{ categoria }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="w-12 h-12 text-primary-500 animate-spin" />
      </div>

      <!-- Productos Grid -->
      <div v-else-if="productosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="producto in productosFiltrados" 
          :key="producto._id"
          class="card hover:shadow-glow-lg transition-all duration-300 group"
        >
          <!-- Imagen del producto -->
          <div class="relative mb-4 h-48 bg-dark-700 rounded-lg overflow-hidden">
            <img 
              v-if="producto.imagen"
              :src="producto.imagen" 
              :alt="producto.nombre"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Package class="w-16 h-16 text-gray-600" />
            </div>
            
            <!-- Badge de stock -->
            <div 
              v-if="producto.stock <= 5 && producto.stock > 0"
              class="absolute top-2 right-2 bg-yellow-500 text-dark-900 px-2 py-1 rounded text-xs font-bold"
            >
              ¡Pocas unidades!
            </div>
            <div 
              v-else-if="producto.stock === 0"
              class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
            >
              Agotado
            </div>
          </div>

          <!-- Categoría -->
          <span class="inline-block px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-xs font-semibold mb-2">
            {{ producto.categoria }}
          </span>

          <h3 class="text-xl font-display font-bold text-white mb-2">
            {{ producto.nombre }}
          </h3>

          <p class="text-gray-400 text-sm mb-4 line-clamp-2">
            {{ producto.descripcion }}
          </p>

          <div class="flex items-center justify-between mt-auto">
            <div>
              <p class="text-primary-500 font-bold text-2xl">
                ${{ producto.precio.toLocaleString() }}
              </p>
              <p class="text-gray-500 text-xs">Stock: {{ producto.stock }}</p>
            </div>
            
            <button 
              @click="agregarAlCarrito(producto)"
              :disabled="producto.stock === 0"
              class="btn-primary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <Package class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">No hay productos disponibles</p>
      </div>

      <!-- Carrito flotante -->
      <div 
        v-if="carrito.length > 0"
        class="fixed bottom-8 right-8 bg-primary-500 text-white px-6 py-4 rounded-full shadow-glow-lg cursor-pointer hover:scale-105 transition-transform"
        @click="mostrarCarrito = true"
      >
        <div class="flex items-center space-x-3">
          <ShoppingCart class="w-6 h-6" />
          <span class="font-bold">{{ totalItems }} items</span>
          <span class="font-bold">${{ totalCarrito.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Modal del carrito (simplificado para el MVP) -->
    <div 
      v-if="mostrarCarrito"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="mostrarCarrito = false"
    >
      <div class="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-display font-bold text-white">Tu Carrito</h2>
          <button @click="mostrarCarrito = false" class="text-gray-400 hover:text-white">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4 mb-6">
          <div 
            v-for="(item, index) in carrito" 
            :key="index"
            class="flex items-center justify-between bg-dark-700 p-4 rounded-lg"
          >
            <div class="flex-1">
              <h3 class="text-white font-semibold">{{ item.nombre }}</h3>
              <p class="text-gray-400 text-sm">${{ item.precio.toLocaleString() }} c/u</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-white">Cantidad: {{ item.cantidad }}</span>
              <button 
                @click="eliminarDelCarrito(index)"
                class="text-red-500 hover:text-red-400"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-dark-700 pt-4">
          <div class="flex justify-between text-xl font-bold text-white mb-4">
            <span>Total:</span>
            <span class="text-primary-500">${{ totalCarrito.toLocaleString() }}</span>
          </div>
          <button class="w-full btn-primary">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productosAPI } from '@/services/api'
import { 
  Package, 
  ShoppingCart, 
  Loader2, 
  X, 
  Trash2 
} from 'lucide-vue-next'

const productos = ref([])
const loading = ref(true)
const categoriaSeleccionada = ref('Todos')
const carrito = ref([])
const mostrarCarrito = ref(false)

const categorias = computed(() => {
  const cats = ['Todos', ...new Set(productos.value.map(p => p.categoria))]
  return cats
})

const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'Todos') {
    return productos.value
  }
  return productos.value.filter(p => p.categoria === categoriaSeleccionada.value)
})

const totalItems = computed(() => {
  return carrito.value.reduce((sum, item) => sum + item.cantidad, 0)
})

const totalCarrito = computed(() => {
  return carrito.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
})

const cargarProductos = async () => {
  try {
    loading.value = true
    const { data } = await productosAPI.obtenerTodos({ activo: true })
    productos.value = data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

const agregarAlCarrito = (producto) => {
  const itemExistente = carrito.value.find(item => item._id === producto._id)
  if (itemExistente) {
    itemExistente.cantidad++
  } else {
    carrito.value.push({
      ...producto,
      cantidad: 1
    })
  }
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
  if (carrito.value.length === 0) {
    mostrarCarrito.value = false
  }
}

onMounted(() => {
  cargarProductos()
})
</script>
