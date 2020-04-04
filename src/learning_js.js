
// Arrays
document.write("Arrays <br />");
document.write(" <br />");

var ar = [1, "ok", 1.2];
document.write("array:  " + ar + " <br />");
document.write("array[0]:  " + ar[0] + " <br />");
document.write("array[1]:  " + ar[1] + " <br />");

ar[1] = 1.1;
document.write("array[1]:  " + ar[1] + " <br />");

// Array functions
document.write(" <br />");
document.write(" <br />");
document.write("Array functions <br />");
document.write(" <br />");
var array2 = new Array("one", "two", "three", "four", "five");
document.write("array2:  " + array2 + " <br />");

Array.prototype.printfun = function(){
    for (i=0;i<this.length;i++){
        document.write(this[i] + "<br />");
    }
}
array2.printfun();

document.write(" <br />");
document.write("array2 length:  " + array2.length + " <br />");

array2.reverse();
document.write("array2 reverse:  " + array2 + " <br />");

array2.sort();
document.write("array2 sort:  " + array2 + " <br />");

array2.pop();
document.write("array2 pop:  " + array2 + " <br />");

array2.shift();
document.write("array2 shift:  " + array2 + " <br />");

array2.push("another");
document.write("array2 push:  " + array2 + " <br />");


// Loops
document.write(" <br />");
document.write(" <br />");
document.write("loops <br />");
document.write(" <br />");


document.write("while loop for fib numbers <br />");
var i = 0, j = 1, k;
while (i<40){
    document.write(i + ", ");
    k = i+j;
    i = j;
    j = k;
}
document.write("<br />");

document.write("do loop for fib numbers <br />");
var i = 0, j = 1;
do{
    document.write(i + ", ");
    k = i+j;
    i = j;
    j = k;
}while(i<40)
document.write("<br />");

document.write("for loop for fib numbers <br />");
var c;
for (a=0,b=1;a<40;a=b,b=c){
    document.write(a + ", ");
    c = a + b;
}
document.write("<br />");

// Conditions
document.write(" <br />");
document.write(" <br />");
document.write("Conditions <br />");

var x = 3, y = 3;

if(x<y){
    document.write("x is less than y <br />");
}
else if (x = y){
    document.write("x is equal to y <br />");
}
else{
    document.write("x is greater than y <br />");
}

// Functions
document.write(" <br />");
document.write(" <br />");
document.write("Functions <br />");
document.write(" <br />");

function countVowels(name){
    var count = 0;
    for (var i=0;i<name.length;i++){
        if(name[i] == "a" || name[i] == "e" || name[i] == "i" || name[i] == "o" || name[i] == "u")
        count++;
    }
    document.write("Hello " + name + "!!! Your name has " + count + " vowels.");
}
countVowels("afrfoierfnorvo");

// Objects
document.write(" <br />");
document.write(" <br />");
document.write("Objects <br />");
document.write(" <br />");

var obj1 = new Object();
document.write(obj1 + "Objects <br />");
obj1.property = 1;
obj1.method = function(){
    document.write("Function1 <br/>");
    return "ok1";
}
document.write(obj1.property + " <br />");
document.write(obj1.method() + " <br />");

var obj2 = {property2:2, method2: function(){
    document.write("Function2 <br/>");
    return "ok2";
    }
}
document.write(obj2.property2 + " <br />");
document.write(obj2.method2() + " <br />");

document.write(" <br />");
document.write("Object constructor <br />");
function Student(first, last, id, english, maths, science)
        {
          this.fName = first;
          this.lName = last;
          this.id = id;
          this.markE = english;
          this.markM = maths;
          this.markS = science;
          this.calculateAverage = function()
          {
         	 return (this.markE + this.markM + this.markS)/3;
          }
		  this.displayDetails = function()
		  {
            document.write("Student Id: " + this.id + "<br />");
            document.write("Name: " + this.fName + " " + this.lName + "<br />");
            var avg = this.calculateAverage();
            document.write("Average Marks: " + avg + "<br /><br />");
		  }
		}

var st1 = new Student("John", "Smith", 15, 85, 79, 90);
st1.displayDetails();
for(var x in st1){
    document.write(x + ": " + st1[x] + "<br/>");
}

