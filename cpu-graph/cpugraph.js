
var cpugraph,memgraph,disgraph
var cpucount,memtotal,distotal
var drivelist=[],drivecount=0

function loadMain()
{
  document.getElementById('cpugraph').appendChild(cpugraph=document.createElement('span'))
  document.getElementById('memgraph').appendChild(memgraph=document.createElement('span'))
  document.getElementById('disgraph').appendChild(disgraph=document.createElement('span'))
  cpugraph.className=memgraph.className=disgraph.className='positioner'

  for (var i=0;i<30;i++)
    cpugraph.appendChild(document.createElement('span')).className='graph'

  for (var i=0;i<5;i++)
    memgraph.appendChild(document.createElement('span')).className='graph'

  disgraph.appendChild(document.createElement('span')).className='graph'

  cpucount=System.Machine.CPUs.count
  memtotal=System.Machine.totalMemory

  distotal=0
  for (var i=65;i<=90;i++) {
    var drive=System.Shell.drive(String.fromCharCode(i))
    if (!drive || !drive.isReady || drive.driveType!=3) continue

    drivelist.push(drive.driveLetter)
    drivecount++
    distotal+=parseFloat(drive.totalSize)
  }

  cpuupdate()
  memupdate()
  disupdate()

  setInterval(cpuupdate,500)
  setInterval(memupdate,3000)
  setInterval(disupdate,180000)
}

function cpuupdate()
{
  var cpusum=0

  for (var i=0;i<cpucount;i++)
    cpusum+=System.Machine.CPUs.item(i).usagePercentage

  rotate(cpugraph,cpusum/cpucount)
}

function memupdate()
{
  rotate(memgraph,100-System.Machine.availableMemory*100/memtotal)
}

function disupdate()
{
  var dissum=0

  for (var i=0;i<drivecount;i++)
    dissum+=parseFloat(System.Shell.drive(drivelist[i]).freeSpace)

  rotate(disgraph,(distotal-dissum)*100/distotal)
}

function rotate(graph,value)
{
  var one=graph.removeChild(graph.firstChild)
  one.style.height=Math.max(Math.round(value*50/100),1)+'px'
  graph.appendChild(one)
}
