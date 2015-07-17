Account = {blance:2}
function Account:new(o)
	o = o or {}
	setmetatable(o, self)
	self.__index = self
	return o
end

function Account:deposit(v)
	print("mememe")
end

function Account1:new(o)
	o = o or {}
	setmetatable(o, {__index = self})
	return o
end

a = Account:new()
a:deposit(2)