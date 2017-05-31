## Python简单排序

今天发现在Python中可以进行

```python
a,b=b,a
```
这样的多变量赋值操作，想起来以前写C语言的时候，如果两个数进行数值交换还要引入中间变量，觉得这样确实方便许多。利用这个特性实现一下基础的排序算法。

### 冒泡排序

冒泡排序在我看来是最简单的排序方法了，它的思路很直观，代码量也很少。

```python
def buble_sort(numbs):
	for i in range(len(nums)):
		for j in range(i+1,len(nums)):
			if nums[i]>nums[j]:
				nums[i],nums[j]=nums[j],nums[i]
```

跟C语言很像，只是最后一行利用了Python的多变量赋值特性。

### 快速排序

快速排序是我认为比较难的排序方法了，虽然它的思路也不是很复杂:基本就是分治，每次都选一个中间值，并将数据排列成前部分小于中间值，后部分大于中间值的顺序，再对前后两部分执行类似的操作，直到最后每部分只剩下一个元素。但是，实上过程上比冒泡排序难上不少。

```python
def quick_sort(nums):
	def average(ns):
		c=0
		for x in ns:
			c+=x
		return c/(len(ns))

	def f(i,j):
		if(j<=i):
			return
		c=average(nums[i:j+1])
		tempi,tempj=i,j
		while tempi<tempj:
			if nums[tempi]<=c:
				tempi+=1
			else:
				nums[tempi],nums[tempj]=nums[tempj],nums[tempi]
				tempj-=1
		f(i,tempi)
		f(tempi+1,j)
        
	f(0,len(nums)-1)
```

除了利用Python中的多变量赋值特性，还用了函数嵌套，即函数内部再定义一些子函数，这样代码会更清晰一些，也提升了内聚性。
